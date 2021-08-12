<?php

namespace App\Entity;

use App\Entity\Appointments;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\PrestationsRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=PrestationsRepository::class)
 * @ApiResource(
 *  normalizationContext={"groups"={"read:presta"}},
 *  itemOperations={
 *      "get"={},
 *  },
 *  collectionOperations={
 *       "get"={},
 *       "get_prestations"={
 *          "method"="GET",
 *          "path"="/prestations/get/{id}",
 *          "controller"=App\Controller\Api\GetPrestations::class
 *       }
 *  }
 * )
 */
class Prestations
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read:presta", "read:appointments", "read:collaborateur", "read:category"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:presta", "read:appointments", "read:collaborateur", "read:category"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:presta", "read:appointments", "read:collaborateur", "read:category"})
     */
    private $image;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"read:presta", "read:appointments", "read:collaborateur", "read:category"})
     */
    private $prestaTime;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"read:presta", "read:appointments", "read:collaborateur", "read:category"})
     */
    private $price;

    /**
     * @ORM\ManyToOne(targetEntity=Users::class, inversedBy="prestation")
     */
    private $users;

    /**
     * @ORM\OneToMany(targetEntity=Appointments::class, mappedBy="prestation")
     */
    private $appointement;

    /**
     * @ORM\ManyToOne(targetEntity=Categories::class, inversedBy="prestations")
     * @Groups({"read:presta", "read:appointments"})
     */
    private $category;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"read:presta", "read:appointments", "read:collaborateur", "read:category"})
     */
    private $breakTime;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:presta", "read:appointments", "read:collaborateur", "read:category"})
     */
    private $agendaColor;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"read:presta", "read:appointments", "read:collaborateur", "read:category"})
     */
    private $prestaTime2;

    public function __construct()
    {
        $this->appointement = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getPrestaTime(): ?int
    {
        return $this->prestaTime;
    }

    public function setPrestaTime(int $prestaTime): self
    {
        $this->prestaTime = $prestaTime;

        return $this;
    }

    public function getUsers(): ?Users
    {
        return $this->users;
    }

    public function setUsers(?Users $users): self
    {
        $this->users = $users;

        return $this;
    }

    public function getCategory(): ?Categories
    {
        return $this->category;
    }

    public function setCategory(?Categories $category): self
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection|Appointments[]
     */
    public function getAppointement(): Collection
    {
        return $this->appointement;
    }

    public function addAppointement(Appointments $appointement): self
    {
        if (!$this->appointement->contains($appointement)) {
            $this->appointement[] = $appointement;
            $appointement->setPrestation($this);
        }

        return $this;
    }

    public function removeAppointement(Appointments $appointement): self
    {
        if ($this->appointement->removeElement($appointement)) {
            // set the owning side to null (unless already changed)
            if ($appointement->getPrestation() === $this) {
                $appointement->setPrestation(null);
            }
        }

        return $this;
    }

    public function getBreakTime(): ?int
    {
        return $this->breakTime;
    }

    public function setBreakTime(?int $breakTime): self
    {
        $this->breakTime = $breakTime;

        return $this;
    }

    public function getAgendaColor(): ?string
    {
        return $this->agendaColor;
    }

    public function setAgendaColor(string $agendaColor): self
    {
        $this->agendaColor = $agendaColor;

        return $this;
    }

    public function getPrestaTime2(): ?int
    {
        return $this->prestaTime2;
    }

    public function setPrestaTime2(?int $prestaTime2): self
    {
        $this->prestaTime2 = $prestaTime2;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(?int $price): self
    {
        $this->price = $price;

        return $this;
    }
    
}
