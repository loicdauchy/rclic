<?php

namespace App\Form;

use App\Entity\Categories;
use App\Entity\Prestations;
use App\Repository\CategoriesRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ColorType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class AddPrestationType extends AbstractType
{
    private $categoryRepository;

    private $security;

    public function __construct(
        CategoriesRepository $categoryRepository,
        Security $security
    )
    {
        $this->categoryRepository = $categoryRepository;
        $this->security = $security;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nom de la prestation'
            ])
            ->add('image', FileType::class, [
                'label' => 'Insérez votre image',
                'mapped' => false
            ])
            ->add('prestaTime', IntegerType::class, [
                'label' => 'Durée en minutes'
            ])
            ->add('price', IntegerType::class, [
                'label' => 'Prix de la prestation'
            ])
            ->add('category', EntityType::class, [
                'class' => Categories::class,
                'label' => 'Selectionnez une catégorie',
                'required' => false,
                'choices' => $this->categoryRepository->findCategoryByUser($this->security->getUser())
            ])
            ->add('agendaColor', HiddenType::class, [
                'label' => 'Choississez la couleur de votre prestation',
                'required' => false,
            ])
            ->add('breakTime', IntegerType::class, [
                'label' => 'Durée du temps de pause',
                'required' => false
            ])
            ->add('prestaTime2', IntegerType::class, [
                'label' => 'Durée de la seconde parti de la prestation',
                'required' => false
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Prestations::class,
        ]);
    }
}
