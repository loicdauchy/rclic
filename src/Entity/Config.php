<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Repository\ConfigRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ConfigRepository::class)
 * @ApiResource(
 *  normalizationContext={"groups"={"read:config"}},
 *  itemOperations={
 *      "get"={},
 *  },
 *  collectionOperations={
 *       "get"={},
 *       "get_config"={
 *          "method"="GET",
 *          "path"="/config/get/{id}",
 *          "controller"=App\Controller\Api\GetConfig::class
 *       }
 *  }
 * )
 */
class Config
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read:config"})
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity=Users::class, inversedBy="config", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $users;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read:config"})
     */
    private $interfaceBackgroundColor;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read:config"})
     */
    private $buttonBackgroundColor;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read:config"})
     */
    private $textColor;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"read:config"})
     */
    private $buttonTextColor;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsers(): ?Users
    {
        return $this->users;
    }

    public function setUsers(Users $users): self
    {
        $this->users = $users;

        return $this;
    }

    public function getInterfaceBackgroundColor(): ?string
    {
        return $this->interfaceBackgroundColor;
    }

    public function setInterfaceBackgroundColor(?string $interfaceBackgroundColor): self
    {
        $this->interfaceBackgroundColor = $interfaceBackgroundColor;

        return $this;
    }

    public function getButtonBackgroundColor(): ?string
    {
        return $this->buttonBackgroundColor;
    }

    public function setButtonBackgroundColor(?string $buttonBackgroundColor): self
    {
        $this->buttonBackgroundColor = $buttonBackgroundColor;

        return $this;
    }

    public function getTextColor(): ?string
    {
        return $this->textColor;
    }

    public function setTextColor(?string $textColor): self
    {
        $this->textColor = $textColor;

        return $this;
    }

    public function getButtonTextColor(): ?string
    {
        return $this->buttonTextColor;
    }

    public function setButtonTextColor(?string $buttonTextColor): self
    {
        $this->buttonTextColor = $buttonTextColor;

        return $this;
    }
}
